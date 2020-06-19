import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.scss'],
})
export class CharacterPage implements OnInit {

  sName = ""
  sImg = {}
  sAudio = {}
  @ViewChild("img", {read: ElementRef})img: ElementRef
  @ViewChild("audio", {read: ElementRef})audio: ElementRef
  constructor(private location: Location, private ds: DataService, private router: Router) { }

  ngOnInit() {
    setTimeout(()=> {
      const elementRef = this.img.nativeElement as HTMLInputElement;
      elementRef.addEventListener('change', (evt: any) => {
        const files = evt.target.files as File[];
        for (let i = 0; i < files.length; i++) {
          this.sImg = this.toBase64(files[i]);
        }
      }, false);
      const elementRef2 = this.audio.nativeElement as HTMLInputElement;
      elementRef2.addEventListener('change', (evt: any) => {
        const files = evt.target.files as File[];
        for (let i = 0; i < files.length; i++) {
          this.sAudio = this.toBase64(files[i]);
        }
      }, false);
    }, 0)
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  submit() {
    if (this.sName.trim() != "") {
      let id
      if (this.ds.CustomCharacters.length != 0){
        id = this.ds.CustomCharacters[this.ds.CustomCharacters.length - 1].id + 1
      }
      else {
        id = 1000
      }
      this.ds.saveCustomChar({
        id: id,
        name: this.sName,
        img: this.sImg['__zone_symbol__value'],
        audio: this.sAudio['__zone_symbol__value'],
        enabled: true
      })
      this.sName = ""
      this.sImg = {}
      this.sAudio = {}
      this.router.navigate(['/characters'])
    }
    else {
      alert("Please fill in a name.")
    }
  }

  back() {
    if (confirm("Are you sure you want to go back? Your character will be lost.")) {
      this.location.back();
    }
  }
}
