import { TavilyIcon } from '@/components/icons'
import { TavilyExtractResponse, TavilySearchResponse } from '@/tools/tavily/types'
import { BlockConfig } from '../types'

type TavilyResponse = TavilySearchResponse | TavilyExtractResponse

export const TavilyBlock: BlockConfig<TavilyResponse> = {
  type: 'tavily_block',
  toolbar: {
    title: 'Tavily',
    description: 'Search and extract information using Tavily AI',
    bgColor: '#0066FF',
    icon: TavilyIcon,
    category: 'tools',
  },
  tools: {
    access: ['tavily_search', 'tavily_extract'],
    config: {
      tool: (params) => {
        switch (params.operation) {
          case 'tavily_search':
            return 'tavily_search'
          case 'tavily_extract':
            return 'tavily_extract'
          default:
            return 'tavily_search'
        }
      },
    },
  },
  workflow: {
    inputs: {
      operation: { type: 'string', required: true },
      apiKey: { type: 'string', required: true },
      // Search operation
      query: { type: 'string', required: false },
      maxResults: { type: 'number', required: false },
      // Extract operation
      urls: { type: 'string', required: false },
      extract_depth: { type: 'string', required: false },
    },
    outputs: {
      response: {
        type: {
          results: 'json',
          answer: 'any',
          query: 'string',
          content: 'string',
          title: 'string',
          url: 'string',
        },
      },
    },
    subBlocks: [
      // Operation selector
      {
        id: 'operation',
        title: 'Operation',
        type: 'dropdown',
        layout: 'full',
        options: [
          { label: 'Search', id: 'tavily_search' },
          { label: 'Extract Content', id: 'tavily_extract' },
        ],
        value: () => 'tavily_search',
      },
      // API Key (common)
      {
        id: 'apiKey',
        title: 'API Key',
        type: 'short-input',
        layout: 'full',
        placeholder: 'Enter your Tavily API key',
        password: true,
      },
      // Search operation inputs
      {
        id: 'query',
        title: 'Search Query',
        type: 'long-input',
        layout: 'full',
        placeholder: 'Enter your search query...',
        condition: { field: 'operation', value: 'tavily_search' },
      },
      {
        id: 'maxResults',
        title: 'Max Results',
        type: 'short-input',
        layout: 'full',
        placeholder: '5',
        condition: { field: 'operation', value: 'tavily_search' },
      },
      // Extract operation inputs
      {
        id: 'urls',
        title: 'URL',
        type: 'long-input',
        layout: 'full',
        placeholder: 'Enter URL to extract content from...',
        condition: { field: 'operation', value: 'tavily_extract' },
      },
      {
        id: 'extract_depth',
        title: 'Extract Depth',
        type: 'dropdown',
        layout: 'full',
        options: ['basic', 'advanced'],
        value: () => 'basic',
        condition: { field: 'operation', value: 'tavily_extract' },
      },
    ],
  },
}
