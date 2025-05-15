export const shuffle = (list) => {
    let currentList = list;
    const newList = [];

    for(let i = 0; i < list.length; i++) {
        const rdm = Math.floor(Math.random() * currentList.length);

        newList.push(currentList[rdm]);
        currentList = currentList.filter((item) => item.nom !== currentList[rdm].nom);
    }

    return newList
}