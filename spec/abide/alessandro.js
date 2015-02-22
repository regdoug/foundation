function validstring(a,b,c) {
    var strval = ['Valid','Invalid','None'];
    return 'A='+strval[a]+' B='+strval[b]+' C='+strval[c];
}

function enterStuff(order,a,b,c) {

    var stuffs = {
        'A':generateName(a),
        'B':generateName(b),
        'C':generateCreditCard(c)
    };
    var selectors = {
        'A':'.name-field',
        'B':'.email-field',
        'C':'.card-field'
    };
    for(i=0;i<3;i++) {
        var field = order[i];
        var stuff = stuffs[field];
        if( stuff ) {
            $(selectors[field]+' input').val(stuff);
        }
    }
    $('button[type=submit]').click();
    jasmine.Clock.tick(500);
    if( 0 == c ) {
        expect($('.card-field .error').css('display')).toBe('none');
    } else {
        expect($('.card-field .error').css('display')).not.toBe('none');
    }
}

function generateName(kind) {
    if( 0 == kind ) {
        return randomString(10,'abcdefghijklmnopqrstuvwzyz');
    } else if( 1 == kind ) {
        return randomString(5,'0123456789');
    } else {
        return '';
    }
}

function generateEmail(kind) {
    if( 0 == kind ) {
        return randomString(10,'abcdsfghijklmnopqrstuvwxyz')+'@example.com';
    } else if ( 1 == kind ) {
        return randomString(10,'abcdefghijklmnopqrstuvwzyz');
    } else {
        return "";
    }
}

function generateCreditCard(kind) {
    if( 0 == kind ) {
        return "4"+randomString(15,'0123456789');
    } else if( 1 == kind ) {
        return randomString(5,'0123456789');
    } else {
        return "";
    }
}

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

describe('abide:alessandro:',function() {
    beforeEach(function() {
        this.addMatchers({
        });

        var origFunc = $.fn.foundation;
        spyOn($.fn, 'foundation').andCallFake(function() {
            var result = origFunc.apply(this, arguments);
            jasmine.Clock.tick(1000);
            return result;
        });
    });

    describe('custom validation', function() {
        beforeEach(function() {
            document.body.innerHTML = __html__['spec/abide/alessandrosantese.html'];
            $(document).foundation({
                abide : {
                  patterns: {
                    dashes_only: /^[0-9-]*$/,
                    ip_address: /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
                    card:/^4(?:[0-9]{12}|[0-9]{15})/
                  }
                }
            });
        });

        var orders = ['ABC','ACB','BAC','BCA','CAB','CBA'];
        //orders = ['ABC'];
        for(i in orders) {
            for(a=0;a<3;a++) {
                for(b=0;b<3;b++) {
                    for(c=0;c<3;c++) {
                        var order = orders[i];
                        var shouldvalidate = (0 == c);
                        it('for order '+orders[i]+' with '+validstring(a,b,c)+' should '+(shouldvalidate?'':'not ')+'validate',function(){
                            var stuffs = {
                                'A':generateName(a),
                                'B':generateName(b),
                                'C':generateCreditCard(c)
                            };
                            var selectors = {
                                'A':'.name-field',
                                'B':'.email-field',
                                'C':'.card-field'
                            };
                            for(i=0;i<3;i++) {
                                var field = order[i];
                                var stuff = stuffs[field];
                                if( stuff ) {
                                    $(selectors[field]+' input').val(stuff);
                                }
                            }
                            //jasmine.Clock.tick(500);
                            $('form').submit();
                            if( shouldvalidate ) {
                                expect($('.card-field input')).toHaveData('valid');
                            } else {
                                expect($('.card-field input')).toHaveData('invalid');
                            }
                        });
                    }
                }
            }
        }
    });
});
