
export const getFilteredStores = (stores, allItems, location, searchText, searching, deliveryType, onlyLocal) => {

    if (searching) {
        const filteredStores = []
        if (deliveryType === 'pickup' && onlyLocal && location) {
            stores.filter(store => store.deliveryType !== 'deliveryOnly').filter(st => Math.abs(Number(st.zipcode) - Number(location[0].postalCode))).forEach(s => {
                allItems.filter(i => {
                    if (i.name.toLowerCase().includes(searchText.toLowerCase()) && s.id === i.storeId && s.hasItems) {
                        let index = filteredStores.indexOf(s)
                        if (index === -1) {
                            filteredStores.push(s)
                        }
                    }

                })
            })
        } else if (location && onlyLocal && deliveryType !== 'pickup') {
            stores.filter(store => store.deliveryType !== 'pickupOnly').filter(st => st.deliveryZip.includes(location[0].postalCode)).forEach(s => {
                allItems.filter(i => {
                    if (i.name.toLowerCase().includes(searchText.toLowerCase()) && s.id === i.storeId && s.hasItems) {
                        let index = filteredStores.indexOf(s)
                        if (index === -1) {
                            filteredStores.push(s)
                        }
                    }

                })
            })
        } else if (!onlyLocal && deliveryType !== 'pickup' && location) {
            stores.filter(store => store.deliveryType !== 'pickupOnly').filter(st => st.deliveryZip.includes(location[0].postalCode)).forEach(s => {
                allItems.filter(i => {
                    if (i.name.toLowerCase().includes(searchText.toLowerCase()) && s.id === i.storeId && s.hasItems) {
                        let index = filteredStores.indexOf(s)
                        if (index === -1) {
                            filteredStores.push(s)
                        }
                    }

                })
            })
        } else if (!onlyLocal && deliveryType === 'pickup') {
            stores.filter(store => store.deliveryType !== 'deliveryOnly').forEach(s => {
                allItems.filter(i => {
                    if (i.name.toLowerCase().includes(searchText.toLowerCase()) && s.id === i.storeId && s.hasItems) {
                        let index = filteredStores.indexOf(s)
                        if (index === -1) {
                            filteredStores.push(s)
                        }
                    }

                })
            })
        }


        return filteredStores
    }

    return location && onlyLocal && deliveryType !== 'pickup' ? stores.filter(s => s.deliveryType !== 'pickupOnly').filter(store => store.deliveryZip.includes(location[0]?.postalCode)) :
        location && onlyLocal && deliveryType === 'pickup' ? stores.filter(store => store.deliveryType !== 'deliveryOnly' && Math.abs(Number(store.zipcode) - Number(location[0]?.postalCode)) <= 1) : !onlyLocal && deliveryType !== 'pickup' ? stores.filter(store => store.deliveryZip) : stores.filter(store => store.deliveryType !== 'pickupOnly')
}

