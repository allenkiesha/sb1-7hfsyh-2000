import { files } from '../components/FileExplorer';
import { mockShopifyData } from '../data/mockShopifyData';

function formatMoney(cents: number, format: string = '${{amount}}') {
  const amount = (cents / 100).toFixed(2);
  return format.replace('{{amount}}', amount);
}

function extractSchemaSettings(content: string): Record<string, any> {
  const schemaMatch = content.match(/{%[-\s]*schema[-\s]*%}([\s\S]*?){%[-\s]*endschema[-\s]*%}/);
  if (!schemaMatch) return {};

  try {
    const schema = JSON.parse(schemaMatch[1]);
    const settings = schema.settings?.reduce((acc: Record<string, any>, setting: any) => {
      acc[setting.id] = setting.default;
      return acc;
    }, {}) || {};

    // Add any preset values
    if (schema.presets?.[0]?.settings) {
      Object.assign(settings, schema.presets[0].settings);
    }

    return settings;
  } catch (e) {
    console.error('Error parsing schema:', e);
    return {};
  }
}

function getSnippetContent(snippetName: string): string {
  const snippetsFolder = files.find(f => f.name === 'snippets');
  const snippet = snippetsFolder?.children?.find(f => f.name === `${snippetName}.liquid`);
  return snippet?.content || `<!-- Snippet '${snippetName}' not found -->`;
}

function getSectionContent(sectionName: string): string {
  const sectionsFolder = files.find(f => f.name === 'sections');
  const section = sectionsFolder?.children?.find(f => f.name === `${sectionName}.liquid`);
  if (!section?.content) return `<!-- Section '${sectionName}' not found -->`;
  
  // Extract the main content (excluding schema)
  const mainContent = section.content.replace(/{%[-\s]*schema[-\s]*%}[\s\S]*?{%[-\s]*endschema[-\s]*%}/g, '');
  
  // Get settings from schema and mock data
  const defaultSettings = extractSchemaSettings(section.content);
  const mockSettings = mockShopifyData.sections[sectionName]?.settings || {};
  const settings = {
    ...defaultSettings,
    ...mockSettings
  };

  // Create section context
  const sectionContext = {
    id: `shopify-section-${sectionName}`,
    settings,
    blocks: []
  };

  // Replace section variables
  let processedContent = mainContent
    .replace(/section\.settings\.(\w+)/g, (match, key) => {
      return settings[key] ?? '';
    })
    .replace(/section\.id/g, sectionContext.id);

  // Process includes within the section
  processedContent = processedContent.replace(
    /{%[-\s]*include[\s]+'([^']+)'[-\s]*%}/g,
    (match, snippetName) => {
      return parseLiquidTemplate(getSnippetContent(snippetName));
    }
  );

  // Handle product loops with mock data
  processedContent = processedContent.replace(
    /{%[-\s]*for[\s]+product[\s]+in[\s]+section\.settings\.products[\s]*%}([\s\S]*?){%[-\s]*endfor[-\s]*%}/g,
    (match, loopContent) => {
      return settings.products?.map(product => {
        let itemContent = loopContent;
        itemContent = itemContent.replace(/\{\{[\s]*product\.([^}]+)[\s]*\}\}/g, (match, key) => {
          const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], product);
          if (key.includes('price')) {
            return formatMoney(value);
          }
          if (key.includes('featured_image') && key.includes('img_url')) {
            return product.featured_image;
          }
          return value ?? '';
        });
        return itemContent;
      }).join('') || '';
    }
  );

  return processedContent;
}

function processImageTag(image: string, alt: string = ''): string {
  const imageUrl = image.startsWith('http') ? image : mockShopifyData.product_image_placeholder;
  return `<img src="${imageUrl}" alt="${alt}" class="w-full h-full object-cover">`;
}

export function parseLiquidTemplate(template: string): string {
  let html = template;

  // Handle layout tags (ignore them in preview)
  html = html.replace(/{%[-\s]*layout.*?[-\s]*%}/g, '');

  // Handle sections first
  html = html.replace(/{%[-\s]*section[\s]+'([^']+)'[-\s]*%}/g, (match, sectionName) => {
    return getSectionContent(sectionName);
  });

  // Handle includes
  html = html.replace(/{%[-\s]*include[\s]+'([^']+)'[-\s]*%}/g, (match, snippetName) => {
    return parseLiquidTemplate(getSnippetContent(snippetName));
  });

  // Handle image_tag filter
  html = html.replace(/\{\{(?:\s*)([^}]+)\s*\|\s*img_tag:\s*([^}]+)\}\}/g, (match, image, alt) => {
    return processImageTag(image.trim(), alt.trim());
  });

  // Handle img_url filter
  html = html.replace(/\{\{(?:\s*)([^}]+)\s*\|\s*img_url:\s*'([^']+)'\s*\}\}/g, (match, image, size) => {
    return image.startsWith('http') ? image : mockShopifyData.product_image_placeholder;
  });

  // Replace basic object properties
  html = html.replace(/\{\{[\s]*([\w\.]*)[\s]*\}\}/g, (match, p1) => {
    const props = p1.split('.');
    let value = mockShopifyData;
    for (const prop of props) {
      value = value?.[prop];
    }
    if (typeof value === 'number' && props.includes('price')) {
      return formatMoney(value);
    }
    return value?.toString() || '';
  });

  // Handle for loops
  html = html.replace(/{%[-\s]*for[\s]*([\w]*)[\s]*in[\s]*([\w\.]*)[\s]*%}([\s\S]*?){%[-\s]*endfor[-\s]*%}/g, 
    (match, itemName, collection, content) => {
      const props = collection.split('.');
      let items = mockShopifyData;
      for (const prop of props) {
        items = items?.[prop];
      }
      
      if (!Array.isArray(items)) return '';
      
      return items.map(item => {
        let itemContent = content;
        itemContent = itemContent.replace(
          new RegExp(`\\{\\{\\s*${itemName}\\.([\\w\\.]*)\\s*\\}\\}`, 'g'),
          (match, p1) => {
            const props = p1.split('.');
            let value = item;
            for (const prop of props) {
              value = value?.[prop];
            }
            if (typeof value === 'number' && props.includes('price')) {
              return formatMoney(value);
            }
            return value?.toString() || '';
          }
        );
        return itemContent;
      }).join('');
    }
  );

  // Handle if conditions
  html = html.replace(/{%[-\s]*if[\s]*([\w\.]*)[\s]*%}([\s\S]*?){%[-\s]*endif[-\s]*%}/g,
    (match, condition, content) => {
      const props = condition.split('.');
      let value = mockShopifyData;
      for (const prop of props) {
        value = value?.[prop];
      }
      return value ? content : '';
    }
  );

  return html;
}