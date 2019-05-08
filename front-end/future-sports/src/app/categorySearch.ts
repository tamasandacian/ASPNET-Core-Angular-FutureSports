import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
    name: 'checkCategory'
  })
  export class CheckCategoryPipe implements PipeTransform {
  
checked:any;

transform(value: any, args: string): any {  
  if (args == null || args == undefined) {  
      return value;  
  }  
  else {  
      let filter = args;  
      return filter ? value.filter(event => (event.categoryName == value)  
      ) : value;   
  }  
}
}