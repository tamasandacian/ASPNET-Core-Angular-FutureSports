import {  Pipe,PipeTransform } from '@angular/core';  
  
@Pipe({  
    name: 'searchFilter'  
})  
  
export class SearchFilter implements PipeTransform {  
    transform(value: any, args: string): any {  
        if (args == null || args == undefined) {  
            return value;  
        }  
        else {  
            let filter = args.toLocaleLowerCase();  
            return filter ? value.filter(event => (event.categoryName.toLocaleLowerCase().indexOf(filter) != -1)  
              || (event.experienceType.toLocaleLowerCase().indexOf(filter) != -1)  
              //  || (event.experienceType.toLocaleLowerCase().indexOf(filter) != -1)  
                ) : value;   
        }  
    }  
}