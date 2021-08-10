import DeepEntity from '@/models/DeepEntity'
import Entity from '@/models/Entity'

export default {

    getTaxonomy(): Promise<DeepEntity[]> {
        return fetch(`${process.env.VUE_APP_API_URL}/taxonomy`)
            .then(response => {
                console.debug(response)
                return response.json()
            })
            .then(data => data.taxonomy)
            .catch(error => console.error(error))
    },

    putTaxonomy(formData: FormData): Promise<void> {
        const fetchOptions = {
            method: 'PUT',
            body: formData
        }

        return fetch(`${process.env.VUE_APP_API_URL}/taxonomy`, fetchOptions)
            .then(response => {
                console.debug(response)
            })
            .catch(error => console.error(error))
    },

    postEntity(entity: Entity): Promise<void> {
        const fetchOptions = {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(entity)
        }

        return fetch(`${process.env.VUE_APP_API_URL}/entity`, fetchOptions)
            .then(response => {
                console.debug(response)
            })
            .catch(error => console.error(error))
    },

    putEntity(entity: Entity): Promise<void> {
        const fetchOptions = {
            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(entity)
        }

        return fetch(`${process.env.VUE_APP_API_URL}/entity`, fetchOptions)
            .then(response => {
                console.debug(response)
            })
            .catch(error => console.error(error))
    },

    deleteEntity(entity_id: number): Promise<void> {
        const fetchOptions = {
            method: 'DELETE'
        }

        return fetch(`${process.env.VUE_APP_API_URL}/entity/${entity_id}`, fetchOptions)
            .then(response => {
                console.debug(response)
            })
            .catch(error => console.error(error))
    }
}
