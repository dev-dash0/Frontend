import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dragn-drop',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor],
  templateUrl: './dragn-drop.component.html',
  styleUrl: './dragn-drop.component.css'
})

export class FiledropComponent implements OnInit {

constructor() { }

    
@Input('label') label: string = '';
@Input('allowedExtensions') allowedExtensions: string[] = [];
@Input('allowMultipleFiles') allowMultipleFiles: boolean = false;

@Output('onFilesDropped') onFilesDropped: EventEmitter<FileList> = new EventEmitter<FileList>();

    ngOnInit() {
        this.allowedList = this.allowedExtensions.length > 0 ?
        this.allowedExtensions.join(', ') : 'any';
    }

    allowedList: string | null = 'null';
    incorrectInput: boolean = false;
    errorMessage: string = '';
    files: File[] = [];

onFiledrop(e: any) {
        e.preventDefault();
        e.stopPropagation();
        this.handleDrop(e.dataTransfer.files);
    }
onFileSelected(e: any) {
        this.handleDrop(e.target.files);
    }
private handleDrop(files: FileList) {
        this.errorMessage = '';
        this.incorrectInput = false;
        this.files = [];
        this.incorrectInput = !this.allowMultipleFiles && files.length > 1;
        if(this.incorrectInput) {
            this.incorrectInput = true;
            this.errorMessage = 'Only one file can be specified';
            return;
        }
        
        this.incorrectInput = !this.validateExtensions(files);
        if(this.incorrectInput) {
            this.errorMessage = 'Incorrect extension noticed';
            return;
        }
        
        this.files = Array.from(files);
        this.onFilesDropped.emit(files);
    }
private validateExtensions(files: FileList): boolean {
        if(this.allowedExtensions.length === 0) {
            return true;
        }
        let extensions: string[] = [];
        const extensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
        
        Array.from(files).map(x => 
            x.name.toLowerCase().match(extensionPattern)!
                .map(ext => extensions.push(ext)));
        const forbidden = extensions.filter((x) => !this.allowedExtensions.includes(x));
        const valid = forbidden.length === 0;
        return valid;
    }
}
