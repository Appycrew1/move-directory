import type { Metadata } from 'next'
import CompareClient from './compare-client'

export const metadata: Metadata = {
  title: 'Compare Suppliers',
  description: 'Compare moving industry suppliers side by side with AI-powered recommendations to make informed decisions.',
}

export default function ComparePage() {
  return <CompareClient />
}
