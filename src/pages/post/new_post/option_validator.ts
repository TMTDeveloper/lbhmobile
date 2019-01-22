import { FormControl } from "@angular/forms";

export class OptionValidator {
  static isValid(control: FormControl): any {
    console.log(control);
    if (control.value.id == "" || control.value.name == "") {
      return {
        "Pilihan belum dipilih": true
      };
    }

    return null;
  }
}
