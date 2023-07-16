import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {

  transform(timestampInSeconds: number,): string {
    const seconds: number = timestampInSeconds % 60
    let minutes: number = Math.floor(timestampInSeconds / 60)
    let hours: number = 0
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60)
      minutes = minutes % 60
    }

    return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }
}
