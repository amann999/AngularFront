import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Root } from './models/car';
import { InsuranceResponse } from './models/response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'insurance';
  msg!: string;
  showDiv: boolean = false
  isQuoteAvailable: boolean = false
  carData!: Root;

  availableCategories: string[] = [];
  availableModels: string[] = [];
  availableMake: string[] = [];




  constructor(private http: HttpClient) {
    this.getCarData();
  }



  insuranceForm = new FormGroup({
    category: new FormControl("", [Validators.required]),
    make: new FormControl("", [Validators.required]),
    model: new FormControl("", [Validators.required]),
    year: new FormControl(-1, [Validators.required]),
    age: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    driving_exp: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    accidents: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    claims: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    value: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    distance: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
    history: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")])
  })


  onSubmit() {
    if (this.insuranceForm.valid) {
      this.showDiv = false;
      this.http.post<InsuranceResponse>("http://localhost:8080/request", this.insuranceForm.value)
        .subscribe({
          next: (resp: InsuranceResponse) => {
            this.showDiv = true;
            this.isQuoteAvailable = resp.success == "success"
            if (this.isQuoteAvailable) {
              this.msg = `Your quote reference number is ${resp.quote_reference}. Premium = $${resp.premium.toFixed(1)}`
            } else {
              this.msg = `Unable to computer quote due to ${resp.msg}. Please contact insurance specialist.`
            }
          },
          error: () => {
            alert("Unable to reach server.")
          }
        })
    } else {
      alert("Please fill all feilds")
    }
  }

  getCarData() {
    this.http.get<Root>('https://storage.googleapis.com/connex-th/insurance_assignment/car_model.json').subscribe({
      next: (v) => {
        this.carData = v;


        this.carData.data.car_Model_Lists.results.forEach((val) => {
          this.pushIfNotExists(this.availableCategories, val.Category);
        })
      }
    })
  }

  onCategoryChange() {
    this.availableMake = [];
    this.availableModels = [];
    this.insuranceForm.patchValue({ make: "", model: "", year: -1 });
    this.carData.data.car_Model_Lists.results.forEach((value) => {
      if (value.Category == this.insuranceForm.value.category) {
        this.pushIfNotExists(this.availableMake, value.Make);
        this.pushIfNotExists(this.availableModels, value.Model);
      }
    })
  }

  onMakeChange() {
    this.availableModels = [];
    this.insuranceForm.patchValue({ model: "", year: -1 });
    this.carData.data.car_Model_Lists.results.forEach((value) => {
      if (value.Category == this.insuranceForm.value.category && value.Make == this.insuranceForm.value.make) {
        this.pushIfNotExists(this.availableModels, value.Model);
      }
    })
  }



  pushIfNotExists(arr: any[], val: any) {
    if (!arr.includes(val)) {
      arr.push(val)
    }
  }

}


