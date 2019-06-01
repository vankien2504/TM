export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function hasValue(value) {
    return !(value === undefined || value === null);
}
export function ChangePage(page, params) {
    this.setState({
        visibleModal: false
    });
    this.props.navigation.navigate(page, params);
}
export function cloneObject(obj) {
    let that = this;
    if (hasValue(obj)) {
        return JSON.parse(JSON.stringify(obj));
    } else {
        return obj
    }
}
export function findItem(lst, id, field) {
    let that = this;
    if (hasValue(id) && hasValue(lst)) {
        let temp = lst.filter(f => {
            return f[field] == id
        });
        if (hasValue(temp) && temp.length > 0) {
            return temp;
        } else {
            return null;
        }
    } else {
        return null;
    }
}