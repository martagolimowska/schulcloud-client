/* HELPER */

if (!NodeList.prototype.addEventListener) {
    NodeList.prototype.addEventListener = function(events, callback, useCapture) {
        this.forEach((entry)=>{
            events.split(" ").forEach((event)=>{
                entry.addEventListener(event, callback, useCapture);
            });
        });
        return this;
    };
}
if (!NodeList.prototype.indexOf) {
    NodeList.prototype.indexOf = function(node) {
        return Array.from(this).indexOf(node);
    }
}
if (!NodeList.prototype.filter) {
    NodeList.prototype.filter = function(fct) {
        return Array.from(this).filter(fct);
    }
}
if (!NodeList.prototype.some) {
    NodeList.prototype.some = function(fct) {
        return Array.from(this).some(fct);
    }
}


/* MULTIPAGE INPUT FORM */

function getMaxSelectionIndex(){
    return document.querySelector(".stages").childElementCount;
}
function getSelectionIndex(){
    var radioButtons = document.querySelectorAll('.form input[type=radio]');
    return radioButtons.indexOf(radioButtons.filter((node)=>{return node.checked;})[0]) + 1;
}
function setSelectionByIndex(index, event){
    if(isSectionValid(getSelectionIndex())){
        document.querySelector('.form input[type="radio"]:nth-of-type(' + index + ')').checked = true;
        updateButton(index);
    }else{
        document.querySelector(`section[data-panel="section-${getSelectionIndex()}"]`).classList.add("showInvalid");
        if(event){
            event.preventDefault();
            document.querySelector(".content-wrapper").scrollTo(0,0);
        }
    }
}
function updateButton(selectedIndex){
    if(selectedIndex == getMaxSelectionIndex()){
        document.querySelector('#nextSection').innerHTML = document.querySelector('#nextSection').dataset.submitLabel;
    }else{
        document.querySelector('#nextSection').innerHTML = document.querySelector('#nextSection').dataset.nextLabel;
    }

    if(selectedIndex == 1){
        document.querySelector('.form #prevSection').setAttribute("disabled","disabled");
    }else{
        document.querySelector('.form #prevSection').removeAttribute("disabled");
    }
    document.querySelector(".content-wrapper").scrollTo(0,0);
}

function isSectionValid(sectionIndex){
    // negation is needed, because some() returns false on a blank array.
    return !document.querySelectorAll(`section[data-panel="section-${sectionIndex}"] input`).some((input)=>{
        return !input.checkValidity();
    });
}

function nextSection(event){
    const selectedIndex = getSelectionIndex() + 1;
    if(selectedIndex <= getMaxSelectionIndex()){
        event.preventDefault();
        setSelectionByIndex(selectedIndex, event);
    }
}
function prevSection(event) {
    const selectedIndex = getSelectionIndex() - 1;
    setSelectionByIndex(selectedIndex); // don't give this method to prevent, to don't prevent on invalid state (back should always be possible)
}
function goToSection(event){
    const selectedIndex = document.querySelectorAll('.form .stages label').indexOf(this) + 1;
    setSelectionByIndex(selectedIndex, (selectedIndex >= getSelectionIndex())?event:undefined);
}
window.addEventListener('DOMContentLoaded', ()=>{
    // Stepper
    document.querySelectorAll('.form .stages label').addEventListener("click", goToSection);
    document.querySelector('.form #prevSection').addEventListener("click", prevSection);
    document.querySelector('.form #nextSection').addEventListener("click", nextSection);
});


/* INPUT LINKING */
function linkInputs(event){
    document.querySelectorAll(`*[data-from=${this.getAttribute("name")}]`).forEach((changeTarget)=>{
        if(changeTarget.tagName == "INPUT"){
            changeTarget.value = this.value;
        }else{
            changeTarget.innerHTML = this.value;
        }
    });
}
window.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll(".linked").addEventListener("change keyup paste click", linkInputs);
});

/* DATE PICKER */
function readPickerConfig(input){
    return {
        format: ($(input).data('datetime')?'d.m.Y H:i':'d.m.Y'),
        mask: ($(input).data('datetime')?'39.19.9999 29:59':'39.19.9999'),
        timepicker: ($(input).data('datetime') || false),
        startDate: ($(input).data('startDate') || false),
        minDate: ($(input).data('minDate') || 'yesterday'), //yesterday is minimum date(for today use 0 or -1970/01/01)
        maxDate: ($(input).data('maxDate') || 'tomorrow')  //tomorrow is maximum date calendar
    }
}
window.addEventListener('load', ()=>{
    // https://xdsoft.net/jqplugins/datetimepicker/
    $.datetimepicker.setLocale('de');
    document.querySelectorAll('input[data-date], input[data-datetime]').forEach((input)=>{
        $(input).datetimepicker(readPickerConfig(input));
        input.setAttribute("autocomplete","off");
        // modified regex from: https://www.regextester.com/97612
        input.setAttribute("pattern",$(input).data('datetime')?
            `(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)[0-9]{2})[[:space:]][0-2][0-3]:[0-5][0-9]`:
            `(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)[0-9]{2})`);
    })
});

/* OTHER STUFF */
window.addEventListener('load', ()=>{
    // INSERT CUSTOM SCRIPTS HERE
});