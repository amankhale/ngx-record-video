import { NgModule } from '@angular/core';
import { NgxRecordVideoComponent } from './ngx-record-video.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';



@NgModule({
  declarations: [
    NgxRecordVideoComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NgxRecordVideoComponent
  ]
})
export class NgxRecordVideoModule { }
