import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {

    console.log('Hello World in Hello Handler');

    return new Response(JSON.stringify({
        message: 'Hello World',
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}