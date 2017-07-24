import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'input-renderer',
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css']
})
export class InputRendererComponent implements OnInit {

  @Input() input: any;
  @Input() inputName: string;

  constructor() { }

  ngOnInit() {
  }

}
