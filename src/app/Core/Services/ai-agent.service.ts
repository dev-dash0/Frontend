import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiAgentService {
  constructor(private zone: NgZone) {}

  /**
   * Starts a streaming POST request to the AI agent endpoint and emits responses as they come.
   * @param payload The request body to send to the agent
   */
  interactWithAgent(payload: any): Observable<any> {
    return new Observable((observer) => {
      const token = localStorage.getItem('token'); // أو استخدم المفتاح اللي مخزن بيه

      fetch('https://8e41-156-203-201-194.ngrok-free.app/api/v1/llm/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder('utf-8');

          const read = () => {
            reader?.read().then(({ done, value }) => {
              if (done) {
                observer.complete();
                return;
              }

              const chunk = decoder.decode(value, { stream: true });

              chunk
                .trim()
                .split('\n')
                .forEach((line) => {
                  if (!line.trim()) return;

                  // 👇 نظّف السطر من "data: " لو موجود
                  const cleaned = line.startsWith('data: ')
                    ? line.slice(6)
                    : line;

                  try {
                    const json = JSON.parse(cleaned);
                    
                    console.log('[AI Agent Response]', json);

                    this.zone.run(() => observer.next(json));
                  } catch (e) {
                    console.warn('Invalid JSON:', cleaned);
                  }
                });
              

              read(); // continue reading
            });
          };

          read();
        })
        .catch((error) => {
          this.zone.run(() => observer.error(error));
        });
    });
  }
}
