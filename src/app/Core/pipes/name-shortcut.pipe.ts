import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameShortcut',
  standalone: true,
})
export class NameShortcutPipe implements PipeTransform {
  // transform(value: unknown, ...args: unknown[]): unknown {
  //   return null;
  // }

  transform(value: string): string {
    if (!value) return '';

    const names = value.trim().split(' ');
    if (names.length < 2) return names[0].charAt(0).toUpperCase(); // If only one name

    const firstInitial = names[0].charAt(0).toUpperCase();
    const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }
}
