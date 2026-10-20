import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { refresh } from '@/stores/slices/authSlice';

export const TASKS_CHANGED_EVENT = 'fisht:tasks-changed';
export const NOTIFICATIONS_CHANGED_EVENT = 'fisht:notifications-changed';

export function useLiveEvents() {
    const token = useAppSelector((state) => state.auth.token);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!token) return;
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout> | undefined;

        const connect = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
                    headers: { Authorization: `Bearer ${token}` },
                    credentials: 'include',
                    signal: controller.signal,
                });
                if (response.status === 401) {
                    await dispatch(refresh());
                    return;
                }
                if (!response.ok || !response.body) throw new Error('Поток событий недоступен');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                while (!controller.signal.aborted) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';
                    for (const line of lines) {
                        if (!line || line.startsWith(':')) continue;
                        const event = JSON.parse(line) as { type: string };
                        if (event.type === 'ready') {
                            window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
                            window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
                        } else if (event.type === 'task_changed') {
                            window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
                        } else if (event.type === 'notifications_changed') {
                            window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
                        }
                    }
                }
            } catch {
                // После краткого обрыва соединения повторно подключаемся и синхронизируем данные.
            }
            if (!controller.signal.aborted) timer = setTimeout(connect, 3000);
        };

        void connect();
        return () => {
            controller.abort();
            if (timer) clearTimeout(timer);
        };
    }, [token, dispatch]);
}
