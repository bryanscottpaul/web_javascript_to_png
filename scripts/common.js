console.log('imported common.js');

var width = window.innerWidth;
var height = window.innerHeight;

console.log("width:" + width);
console.log("height:" + height);

var bool_menu = true;
var bool_light = true;

function class_add(id_edit, class_new) {
    let id_field = document.getElementById(id_edit);
    id_field.classList.add(class_new);
}
function class_remove(id_edit, class_old) {
    let id_field = document.getElementById(id_edit);
    id_field.classList.remove(class_old);
}
function get_css_variable(css_name) {
    const css_variable = getComputedStyle(document.documentElement);
    return css_variable.getPropertyValue(css_name).trim();
}
function get_classes_on_id(id_from) {
    let my_id = document.getElementById(id_from);
    let my_classes = Array.from(my_id.classList);
    return my_classes;
}
function blink(myLink) {
    console.log(myLink);
    window.open(myLink, "_self");
}
function bmenu() {
    console.log("bmenu");
    let my_drop = document.getElementById("dropbox");
    if (bool_menu) {
        document.getElementById("bmenu").src = "images/icons/close.svg";
        my_drop.style.display = "block";
        bool_menu = false;
    } else {
        document.getElementById("bmenu").src = "images/icons/menu.svg";
        my_drop.style.display = "none";
        bool_menu = true;
    }
}
function blight() {
    console.log("blight");
    let root = document.documentElement;
    let image = document.getElementById("blight");
    if (bool_light) {
        root.style.setProperty('--color-foreground', 'var(--color-foreground-dark)');
        root.style.setProperty('--color-background', 'var(--color-background-dark)');
        root.style.setProperty('--color-middleground', 'var(--color-middleground-dark)');
        root.style.setProperty('--color-horizon', 'var(--color-horizon-dark)');
        root.style.setProperty('--color-text', 'var(--color-text-dark)');
        root.style.setProperty('--color-error', 'var(--color-error-dark)');
        root.style.setProperty('--color-svg', 'var(--color-svg-filter-dark)');
        root.style.setProperty('--color-border', 'var(--color-border-dark)');
        root.style.setProperty('--color-border-haze', 'var(--color-border-haze-dark)');
        image.classList.toggle("rotate");
        bool_light = false;
    } else {
        root.style.setProperty('--color-foreground', 'var(--color-foreground-light)');
        root.style.setProperty('--color-background', 'var(--color-background-light)');
        root.style.setProperty('--color-middleground', 'var(--color-middleground-light)');
        root.style.setProperty('--color-horizon', 'var(--color-horizon-light)');
        root.style.setProperty('--color-text', 'var(--color-text-light)');
        root.style.setProperty('--color-error', 'var(--color-error-light)');
        root.style.setProperty('--color-svg', 'var(--color-svg-filter-light)');
        root.style.setProperty('--color-border', 'var(--color-border-light)');
        root.style.setProperty('--color-border-haze', 'var(--color-border-haze-light)');
        image.classList.toggle("rotate");
        bool_light = true;
    }
}