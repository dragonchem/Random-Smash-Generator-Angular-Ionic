import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage'
import { HttpClient } from '@angular/common/http';

import * as Default from '../../assets/json/default.json';
import * as Disabled from '../../assets/json/disabled.json';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  Presets
  Characters
  CustomCharacters
  Volume
  IronMan

  constructor(private storage: Storage, private http: HttpClient) {
    this.load()
  }

  save() {
    setTimeout(async () => {
      await this.storage.set("Volume", this.Volume)
      await this.storage.set("IronMan", this.IronMan)
    }, 0);
  }

  async remove(id) {
    let char = this.Characters.filter(item => {
      return item.id === id
    })
    if (char.length == 0) {
      char = this.CustomCharacters.filter(item => {
        return item.id === id
      })
    }
    if (this.Characters.indexOf(char[0]) >= 0) {
      this.Characters[this.Characters.indexOf(char[0])].enabled = false
      this.storage.set("Characters1", this.Characters)
    }
    else {
      console.log(char[0])
      this.CustomCharacters[this.CustomCharacters.indexOf(char[0])].enabled = false
      this.storage.set("CustomCharacters", this.CustomCharacters)
    }
  }

  async load() {
    this.IronMan = await this.storage.get("IronMan")
    if (this.IronMan == null) {
      this.IronMan = false
      await this.storage.set("IronMan", false)
    }
    this.Volume = await this.storage.get("Volume")
    if (this.Volume == null) {
      this.Volume = 100
      await this.storage.set("Volume", false)
    }
    this.Presets = await this.storage.get("Presets")
    if (this.Presets == null) {
      this.Presets = []
      await this.storage.set("Presets", [])
    }
    this.Characters = await this.storage.get("Characters1")
    this.CustomCharacters = await this.storage.get("CustomCharacters")
    if (this.CustomCharacters == null) {
      await this.storage.set("CustomCharacters", [])
      this.CustomCharacters = []
    }
    if (this.Characters == null) {
      this.Characters = Default['default'].characters
    }
  }

  async removePreset(preset) {
    if (confirm("Are you sure you'd like to delete: '" + preset.name + "'?")) {
      this.Presets.splice(this.Presets.indexOf(preset), 1)
      await this.storage.set("Presets", this.Presets)
    }
  }

  async all(bool) {
    let preset = {
      characters: [],
      customCharacters: []
    }
    this.Characters.forEach((character, index) => {
      preset.characters.push(character)
      preset.characters[index].enabled = bool
    });
    this.CustomCharacters.forEach((character, index) => {
      preset.customCharacters.push(character)
      preset.customCharacters[index].enabled = bool
    });
    this.Characters = preset.characters
    this.CustomCharacters = preset.customCharacters
    await this.storage.set("Characters1", this.Characters)
    await this.storage.set("CustomCharacters", this.CustomCharacters)
  }

  enableCharacter(index, bool?) {
    this.Characters[index].enabled = bool || !this.Characters[index].enabled
    this.storage.set("Characters1", this.Characters)
  }

  enableCustomCharacter(index, bool?) {
    this.CustomCharacters[index].enabled = bool || !this.CustomCharacters[index].enabled
    this.storage.set("CustomCharacters", this.CustomCharacters)
  }

  saveCustomChar(character) {
    this.CustomCharacters.push(character)
    this.storage.set("CustomCharacters", this.CustomCharacters)
  }

  async savePreset(name) {
    let characters = JSON.parse(JSON.stringify(this.Characters))
    let customcharacters = JSON.parse(JSON.stringify(this.CustomCharacters))
    let preset = {
      name: name,
      characters: characters,
      customCharacters: customcharacters
    }
    this.Presets.push(preset)
    await this.storage.set("Presets", this.Presets)
  }

  async openPreset(preset) {
    if (preset.customCharacters != undefined) {
      preset.customCharacters.forEach((character, index) => {
        this.CustomCharacters[index].enabled = character.enabled
      });
      await this.storage.set("CustomCharacters", this.CustomCharacters)
    }
    preset.characters.forEach((character, index) => {
      this.Characters[index].enabled = character.enabled
    });
    await this.storage.set("Characters1", this.Characters)
  }
}
