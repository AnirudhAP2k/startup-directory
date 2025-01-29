import { formateDate } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { STARTUPS_BY_ID_QUERY } from '@/sanity/lib/queries';
import Views from '@/components/Views';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import markdownit from 'markdown-it'
import React, { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton';

export const experimental_ppr = true;

const md = markdownit()

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const post = await client.fetch(STARTUPS_BY_ID_QUERY, { id });
    
    if (!post) return notFound();
    
    const parsedContent = md.render(post?.pitch || '') ;
    
    return (
        <>
            <section className='pink_container !min-h-[230px]'>
                <p className='tag'>{formateDate(post?._createdAt)}</p>
                <h1 className='heading'>{post?.title}</h1>
                <p className='sub-heading !max-w-5xl'>{post?.description}</p>
            </section>

            <section className='section_container'>
                <img src={post?.image} alt="thumbnail" className='w-full h-auto rounded-xl' />
                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='flex-between gap-5'>
                        <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                            <Image src={post.author?.image} alt="avatar" width={64} height={64} className='rounded-full drop-shadow-lg' />
                            <div>
                                <p className='text-20-medium'>{post.author?.name}</p>
                                <p className='text-15-medium !text-black-300'>@{post.author?.username}</p>
                            </div>
                        </Link>
                        <p className='category-tag'>{post.category}</p>
                    </div>

                    <h3 className='text-30-bold'>Pitch Details</h3>
                    {parsedContent ? (
                        <article className='prose max-w-4xl font-work-sans break-all' dangerouslySetInnerHTML={{ __html: parsedContent }} />
                    ) : (
                        <p className='no-result'>No Details Provided</p>
                    )}
                </div>

                <hr className='divider' />

                {/* TODO: EDITOR SELECTED STARTUPS */}

                <Suspense fallback={<Skeleton className='view-skeleton' />}>
                    <Views id={id} />
                </Suspense>
            </section>
        </>
    )
}

export default page
