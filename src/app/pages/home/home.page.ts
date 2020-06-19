import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  Image = '../../../assets/img/random.png'
  Text = "Press the button to randomize a character."

  constructor(public ds: DataService) { }

  ngOnInit() {
  }

  randomize() {
    let filter = []
    this.ds.Characters.forEach(character => {
      character.img = "../../../assets/img/" + character.img
      character.audio = '../../../assets/sound/' + character.audio
      filter.push(character)
    });
    this.ds.CustomCharacters.forEach(character => {
      filter.push(character)
    });
    let char = filter.filter(item => {
      return item.enabled === true
    })
    if (char.length == 0) {
      alert("Please enable at least one character in the Characters tab.")
    }
    else {
      let index = Math.floor(Math.random() * char.length)
      this.Image = char[index].img
      this.Text = char[index].name
      var audio = new Audio(char[index].audio)
      audio.volume = this.ds.Volume / 100
      audio.play()
      if (this.ds.IronMan) {
        this.ds.remove(char[index].id)
      }
    }
  }

}
