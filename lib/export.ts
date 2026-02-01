import { Product, Keyword } from './types'

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
        return `"${stringValue.replace(/"/g, '""')}"`
      }).join(',')
    )
  ].join('\n')
  
  downloadFile(csvContent, `${filename}.csv`, 'text/csv')
}

export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, `${filename}.json`, 'application/json')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function prepareProductsForExport(products: Product[]) {
  return products.map(p => ({
    ID: p.id,
    Title: p.title,
    Price: p.price,
    Platform: p.platform,
    Seller: p.seller,
    Rating: p.rating,
    Reviews: p.reviewCount,
    'Estimated Sales': p.estimatedSales,
    'Listing Age (days)': p.listingAge,
    Category: p.category,
    'Winning Score': p.winningScore,
    Trend: p.trend,
    'Last Updated': p.lastUpdated,
  }))
}

export function prepareKeywordsForExport(keywords: Keyword[]) {
  return keywords.map(k => ({
    Keyword: k.keyword,
    'Search Volume': k.searchVolume,
    'Difficulty': k.difficulty,
    'Competition': k.competition,
    'CPC': k.cpc,
    'Related Keywords': k.relatedKeywords.join('; '),
  }))
}
