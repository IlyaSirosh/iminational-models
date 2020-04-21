import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appReactOnDelay]'
})
export class ReactOnDelayDirective {
  @Input('appReactOnDelay') delay: number;
  @Output() run = new EventEmitter();
  timer = 0;

  @HostListener('keyup')
  setDelay(){
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.run.emit();
    }, this.delay || 500);
  }


}

