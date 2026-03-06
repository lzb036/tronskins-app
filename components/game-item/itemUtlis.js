export const itemImage = function(rarity) {
	return `/static/image/game/item/${rarity ? rarity.color : 'b0c3d9'}.png`;
}