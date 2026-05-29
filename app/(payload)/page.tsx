import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'

import { importMap } from '../(payload)/admin/importMap'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const cleanParams = async (
  params: Args['params'],
): Promise<{ segments: string[] }> => {
  const resolvedParams = await params

  return {
    segments: resolvedParams?.segments ?? [],
  }
}

const cleanSearchParams = async (
  searchParams: Args['searchParams'],
): Promise<Record<string, string | string[]>> => {
  const resolvedSearchParams = await searchParams

  return Object.fromEntries(
    Object.entries(resolvedSearchParams ?? {}).filter(
      ([, value]) => value !== undefined,
    ),
  ) as Record<string, string | string[]>
}

export const generateMetadata = async ({
  params,
  searchParams,
}: Args): Promise<Metadata> => {
  return generatePageMetadata({
    config,
    params: cleanParams(params),
    searchParams: cleanSearchParams(searchParams),
  })
}

const Page = ({ params, searchParams }: Args) => {
  return RootPage({
    config,
    importMap,
    params: cleanParams(params),
    searchParams: cleanSearchParams(searchParams),
  })
}

export default Page