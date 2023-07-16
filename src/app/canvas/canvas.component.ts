import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {TimestampPipe} from '../timestamp.pipe';

interface Point {
  x: number,
  y: number
}

const Y_BOTTOM_COORDINATE: number = 60
const Y_LONG_LINE_TOP_COORDINATE: number = 25
const Y_SHORT_LINE_TOP_COORDINATE: number = 45
const Y_TEXT_COORDINATE: number = 20

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer')
  public canvasContainer!: ElementRef

  @ViewChild('myCanvas')
  public canvas!: ElementRef<HTMLCanvasElement>

  public amountOfSectionsInCanvas: number = 10
  public secondsPrSection: number = 1
  public amountOfSubSectionsPrSection: number = 5

  private context!: CanvasRenderingContext2D

  private canvasWidth: number = 0

  private animationFrameIdentifier: any = undefined

  constructor(private timestampPipe: TimestampPipe) {}


  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.setCanvasSize()
  }

  private setCanvasSize(): void {
    this.canvasWidth = this.canvasContainer.nativeElement.offsetWidth
    this.canvas.nativeElement.width = this.canvasWidth
    this.canvas.nativeElement.height = this.canvasContainer.nativeElement.offsetHeight
  }

  public ngAfterViewInit(): void {
    this.initializeCanvas()
    this.setCanvasSize()
    this.startAnimation()
  }

  private initializeCanvas(): void {
    if (!this.canvasContainer) {
      throw new Error('Canvas Container not loaded!')
    }

    if (!this.canvas) {
      throw new Error('Canvas not loaded!')
    }

    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('Canvas Context not loaded!')
    }
    this.context = context
  }

  public startAnimation(): void {
    if (!this.animationFrameIdentifier) {
      this.animationFrameIdentifier = requestAnimationFrame(time => this.animationFrameCallback(time))
    }
  }

  public stopAnimation(): void {
    if (this.animationFrameIdentifier) {
      cancelAnimationFrame(this.animationFrameIdentifier)
      this.animationFrameIdentifier = undefined
    }
  }

  private animationFrameCallback(timestamp: number): void {
    this.clearCanvas()
    this.draw(timestamp)

    this.animationFrameIdentifier = requestAnimationFrame(time => this.animationFrameCallback(time))
  }

  public ngOnDestroy() {
   this.stopAnimation()
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  private draw(timestampInMilliseconds: number): void {
    const pixelsPrSection: number = this.canvasWidth / this.amountOfSectionsInCanvas
    const millisecondsPrSection: number = this.secondsPrSection * 1000;
    const pixelsPrMillisecond: number = pixelsPrSection / millisecondsPrSection
    const timestampWithinSection: number = timestampInMilliseconds % millisecondsPrSection;

    for (let i: number = 0; i <= this.amountOfSectionsInCanvas; i++) {
      // Multiply with negative one to make the animation go from right to left.
      const x: number = (timestampWithinSection * -1) * pixelsPrMillisecond + (i * pixelsPrSection);
      const from: Point = {
        x,
        y: Y_BOTTOM_COORDINATE
      }
      this.drawLongVerticalLine(from)
      this.drawTimestamp(timestampInMilliseconds, i, x)

      const pixelsPrSubSection: number = pixelsPrSection / this.amountOfSubSectionsPrSection
      for (let j: number = 1; j < this.amountOfSubSectionsPrSection; j++) {
        from.x = x + (pixelsPrSubSection * j)
        this.drawShortVerticalLine(from)
      }
    }
    this.drawBottomLine()
  }

  private drawTimestamp(timestampSinceStartMilliseconds: number, index: number, xCoordinate: number): void {
    let secondsSinceStart: number = Math.floor(timestampSinceStartMilliseconds / 1000)
    const isInNumberTable: boolean = secondsSinceStart % this.secondsPrSection === 0;
    if (!isInNumberTable) {
      // The 'seconds since start' is not in the number table of the current 'seconds pr section' so we need to find the closest number in the table that already has been shown.
      // E.g. 11 is not in the number table of 3, so we need to display 9. 7 is not in the number table of 2, so we need to display 6.
      secondsSinceStart -= secondsSinceStart % this.secondsPrSection
    }
    const secondsToDisplay: number = secondsSinceStart + (index * this.secondsPrSection);
    this.drawText(this.timestampPipe.transform(secondsToDisplay), xCoordinate)
  }

  private drawLongVerticalLine(from: Point): void {
    const to: Point = {
      x: from.x,
      y: Y_LONG_LINE_TOP_COORDINATE
    }
    this.drawStraightLine(from, to)
  }

  private drawShortVerticalLine(from: Point): void {
    const toUp: Point = {
      x: from.x,
      y: Y_SHORT_LINE_TOP_COORDINATE
    }
    this.drawStraightLine(from, toUp)
  }

  private drawBottomLine(): void {
    const from: Point = {
      x: 0,
      y: Y_BOTTOM_COORDINATE
    };
    const to: Point = {
      x: this.canvasWidth,
      y: Y_BOTTOM_COORDINATE
    };
    this.drawStraightLine(from, to)
  }

  private drawStraightLine(from: Point, to: Point): void {
    this.context.beginPath()
    this.context.moveTo(from.x, from.y)
    this.context.lineTo(to.x, to.y)
    this.context.stroke()
  }

  private drawText(text: string, x: number): void {
    this.context.fillText(text, x, Y_TEXT_COORDINATE)
  }
}
