import { Component } from '@angular/core';
import {KitItem} from '../../../../stocktrack/presentation/kit-item/kit-item';

@Component({
  selector: 'app-layout',
  imports: [
    KitItem
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

}
