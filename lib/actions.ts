"use server"

import { auth } from "@/auth"
import { parseServerResposne } from "./utils";
import slugify from 'slugify'
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const createPitch = async (state: any, form: FormData, pitch: string) => {
    const session = await auth();
    if (!session) return parseServerResposne({ error: 'User not signed in', status: 'ERROR' });

    const { title, category, description, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== 'pitch'),
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: slug,
                current: slug,
            },
            author: {
                _type: 'reference',
                _ref:  session?.id,
            },
            pitch
        };

        const result = await writeClient.create( { _type: 'startup', ...startup });

        return parseServerResposne({
            ...result,
            error: '',
            status: 'SUCCESS',
        });
    } catch (error) {
        console.error(error);
        return parseServerResposne({ error: JSON.stringify(error), status: 'ERROR' });
    }
}
