import { Component } from '@angular/core';

@Component({
  selector: 'app-backup-code',
  standalone: true,
  imports: [],
  templateUrl: './backup-code.component.html',
  styleUrl: './backup-code.component.css',
})
export class BackupCodeComponent {
  // ! /////////------------ Drag and drop ----------/////////
  // export class FiledropComponent implements OnInit {
  // constructor() { }
  // @Input('label') label: string = '';
  // @Input('allowedExtensions') allowedExtensions: string[] = [];
  // @Input('allowMultipleFiles') allowMultipleFiles: boolean = false;
  // @Output('onFilesDropped') onFilesDropped: EventEmitter<FileList> = new EventEmitter<FileList>();
  //     ngOnInit() {
  //         this.allowedList = this.allowedExtensions.length > 0 ?
  //         this.allowedExtensions.join(', ') : 'any';
  //     }
  //     allowedList: string | null = 'null';
  //     incorrectInput: boolean = false;
  //     errorMessage: string = '';
  //     files: File[] = [];
  // onFiledrop(e: any) {
  //         e.preventDefault();
  //         e.stopPropagation();
  //         this.handleDrop(e.dataTransfer.files);
  //     }
  // onFileSelected(e: any) {
  //         this.handleDrop(e.target.files);
  //     }
  // private handleDrop(files: FileList) {
  //         this.errorMessage = '';
  //         this.incorrectInput = false;
  //         this.files = [];
  //         this.incorrectInput = !this.allowMultipleFiles && files.length > 1;
  //         if(this.incorrectInput) {
  //             this.incorrectInput = true;
  //             this.errorMessage = 'Only one file can be specified';
  //             return;
  //         }
  //         this.incorrectInput = !this.validateExtensions(files);
  //         if(this.incorrectInput) {
  //             this.errorMessage = 'Incorrect extension noticed';
  //             return;
  //         }
  //         this.files = Array.from(files);
  //         this.onFilesDropped.emit(files);
  //     }
  // private validateExtensions(files: FileList): boolean {
  //         if(this.allowedExtensions.length === 0) {
  //             return true;
  //         }
  //         let extensions: string[] = [];
  //         const extensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
  //         Array.from(files).map(x =>
  //             x.name.toLowerCase().match(extensionPattern)!
  //                 .map(ext => extensions.push(ext)));
  //         const forbidden = extensions.filter((x) => !this.allowedExtensions.includes(x));
  //         const valid = forbidden.length === 0;
  //         return valid;
  //     }
  // }
}
