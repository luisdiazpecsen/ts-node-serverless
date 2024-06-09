import type { Context } from "@netlify/functions"

const notify = async (message: string) => {
    const body = {
        content: message,
        embeds: [
            {
                image: { url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzVxcjE1ZWt1M2tvMHcxanJ6dTB4dThwbjgxcml6bjZ5OXRrcjZ2MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wsUuw16j6oyxLLRnnK/giphy.gif' },
            },
        ],
    };

    const resp = await fetch(process.env.DISCORD_WEBHOOK_URL ?? '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!resp.ok) {
        console.log('Error sending message to Discord');
        return false;
    }

    return true;
}

const onStar = (payload: any): string => {
    const { action, sender, repository } = payload;

    return `User ${sender.login} ${action} star on ${repository.full_name}`;
}

const onIssue = (payload: any): string => {
    const { action, issue } = payload;

    if (action === 'opened') {
        return `An issue was ${action} with this title ${issue.title}`;
    }

    if (action === 'closed') {
        return `An issue was ${action} by ${issue.user.login}`;
    }

    if (action === 'reopened') {
        return `An issue was ${action} by ${issue.user.login}`;
    }

    return `Unhandled action for the issue event ${action}`;
}

export default async (req: Request, context: Context) => {
    const githubEvent = req.headers.get('x-github-event') ?? 'unknown';
    const payload = await req.json();

    console.log(payload);

    let message: string;

    switch (githubEvent) {
        case 'star':
            message = onStar(payload);
            break;
        case 'issues':
            message = onIssue(payload);
            break;
        default:
            message = `Unknown event ${githubEvent}`;
            break;
    }

    await notify(message);

    return new Response(JSON.stringify({
        message: 'done',
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}