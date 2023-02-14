Voici un exemple de tableau d'objets en JavaScript avec cinq objets ayant chacun les propriétés nom, couleur, quantité, et prix :

yaml

const objects = [
  { nom: "Chaise", couleur: "Rouge", quantité: 3, prix: 20 },
  { nom: "Table", couleur: "Noir", quantité: 2, prix: 100 },
  { nom: "Chaise", couleur: "Rouge", quantité: 1, prix: 20 },
  { nom: "Lampe", couleur: "Blanche", quantité: 5, prix: 60 },
  { nom: "Table", couleur: "Noir", quantité: 1, prix: 100 }
];

Pour fusionner les objets ayant le même nom et la même couleur, vous pouvez écrire la fonction suivante en JavaScript :

javascript

function mergeObjects(objects) {
  const result = [];

  objects.forEach(obj => {
    let found = false;
    for (let i = 0; i < result.length; i++) {
      if (result[i].nom === obj.nom && result[i].couleur === obj.couleur) {
        result[i].quantité += obj.quantité;
        found = true;
        break;
      }
    }
    if (!found) {
      result.push(obj);
    }
  });
  Ce code prend en entrée un tableau d'objets et parcourt chaque objet. Pour chaque objet, il vérifie s'il existe déjà un objet ayant les mêmes valeurs pour les propriétés nom et couleur dans le tableau de résultat. Si oui, il ajoute la valeur de la propriété quantité à cet objet. Si non, il ajoute l'objet au tableau de résultat.

Le code retourne un nouveau tableau d'objets qui regroupe les objets ayant les mêmes valeurs pour les propriétés nom et couleur, et qui additionne les valeurs de la propriété quantité pour ces objets.

