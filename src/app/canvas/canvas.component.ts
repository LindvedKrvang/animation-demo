import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';

interface Point {
  x: number,
  y: number
}

const DRAW_INTERVAL_MS: number = 50

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

  private context!: CanvasRenderingContext2D

  private xOffset: number = 0

  private intervalIdentifier: any

  ngAfterViewInit(): void {
    this.initializeCanvas()
    this.setCanvasSize()

    this.intervalIdentifier = setInterval(() => {
      this.clearCanvas()
      this.draw()
      this.xOffset--
    }, DRAW_INTERVAL_MS)
  }

  ngOnDestroy() {
    if (this.intervalIdentifier) {
      clearInterval(this.intervalIdentifier)
      this.intervalIdentifier = undefined
    }
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

  private setCanvasSize(): void {
    this.canvas.nativeElement.width = this.canvasContainer.nativeElement.offsetWidth
    this.canvas.nativeElement.height = this.canvasContainer.nativeElement.offsetHeight
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

  private draw(): void {
    const increment: number = 1
    for (let i = 0; i <= 2000; i += increment) {
      const x: number = i + this.xOffset
      const from: Point = {
        x,
        y: 50
      }

      if (i % 20 === 0) {
        const toUp: Point = {
          x,
          y: 10
        }
        this.drawStraightLine(from, toUp)
      }

      const to: Point = {
        x: x + increment,
        y: 50
      }
      this.drawStraightLine(from, to)
    }
  }

  private drawStraightLine(from: Point, to: Point): void {
    this.context.beginPath()
    this.context.moveTo(from.x, from.y)
    this.context.lineTo(to.x, to.y)
    this.context.stroke()
  }
}
