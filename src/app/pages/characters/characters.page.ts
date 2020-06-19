import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MenuController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.page.html',
  styleUrls: ['./characters.page.scss'],
})
export class CharactersPage implements OnInit {

  constructor(
    public ds: DataService,
    public menu: MenuController,
    private mc: ModalController
  ) { }

  test = []

  ngOnInit() {
  }

  remove(index) {
    if (confirm("Are you sure you would like to delete this character?")) {
      this.ds.CustomCharacters.splice(index, 1)
    }
  }

  openPreset(preset) {
    this.ds.openPreset(preset)
  }

  makePreset() {
    var name = prompt("What would you like to name this preset?")
    if(name != null && name.trim() != "") {
      this.ds.savePreset(name.trim())
    }
  }
}
