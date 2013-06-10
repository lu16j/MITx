function calculate() {
                var input = $('#exp:first');    //define input as the first occurrence of tag 'exp'
                var exp = input.val();          //define exp as input's value
                var out = $('#out:first');      //define out as first occurrence of tag 'exp_out'
                out.text(exp);                  //sticks exp into out, which is new section (div)
}