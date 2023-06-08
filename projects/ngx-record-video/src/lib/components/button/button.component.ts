import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input('label') label: string = '';
  @Output('onClick') onClick = new EventEmitter();

  buttonClick(): void {
    this.onClick.emit();
  }

}
