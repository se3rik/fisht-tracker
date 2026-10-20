import type { Response } from 'express';

type LiveEvent = { type: 'ready' | 'task_changed' | 'notifications_changed' };

const connections = new Map<string, Set<Response>>();

export function addLiveConnection(userId: string, response: Response) {
    const group = connections.get(userId) ?? new Set<Response>();
    group.add(response);
    connections.set(userId, group);
    response.write(`${JSON.stringify({ type: 'ready' } satisfies LiveEvent)}\n`);

    const heartbeat = setInterval(() => response.write(': ping\n'), 25000);
    const expiry = setTimeout(() => response.end(), 5 * 60 * 1000);
    response.on('close', () => {
        clearInterval(heartbeat);
        clearTimeout(expiry);
        group.delete(response);
        if (group.size === 0) connections.delete(userId);
    });
}

export function publishLiveEvent(userIds: Iterable<string>, type: LiveEvent['type']) {
    const line = `${JSON.stringify({ type } satisfies LiveEvent)}\n`;
    for (const userId of new Set(userIds)) {
        for (const response of connections.get(userId) ?? []) response.write(line);
    }
}
