import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbar',
  standalone: true,
  imports: [],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent implements OnInit  {
@Input() f!:number;
constructor(private el:ElementRef){}
ngOnInit():void{
let div;
  if(this.f==1)
  {
const div=this.el.nativeElement.querySelector('.n1');
div.classList.add('active');
  }
  else if(this.f==2)
  {
    div=this.el.nativeElement.querySelector('.n1');
    div.classList.add('active');
     div=this.el.nativeElement.querySelector('.nl1');
     div.classList.add('active');
     div=this.el.nativeElement.querySelector('.n2');
     div.classList.add('active');
  }
  else if(this.f==3)
    {
      div=this.el.nativeElement.querySelector('.n1');
      div.classList.add('active');
       div=this.el.nativeElement.querySelector('.nl1');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.n2');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.nl2');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.n3');
       div.classList.add('active');
  
       
    }
    else if(this.f==4)
    {
      div=this.el.nativeElement.querySelector('.n1');
      div.classList.add('active');
       div=this.el.nativeElement.querySelector('.nl1');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.n2');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.nl2');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.n3');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.nl3');
       div.classList.add('active');
       div=this.el.nativeElement.querySelector('.n4');
       div.classList.add('active');

    }
}
}
