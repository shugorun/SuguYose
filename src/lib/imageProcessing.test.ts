import { describe, expect, it } from 'vitest'
import { enhanceContrast, median, medianFilter, adaptiveThreshold } from './imageProcessing'

describe('enhanceContrast', () => {
    it('enhance the contrast from 128(middle number)', () => {
        const input = { data: new Uint8ClampedArray([100, 100, 100, 255]), width: 1, height: 1}
        const result = enhanceContrast(input, 2)
        expect(result.data[0]).toBe(72)
    })
})

describe('medium', () => {
    it('sort as number', () => {
        expect(median([10,2,1])).toBe(2)
    })
})

describe('medianFilter', () => {
    it('remove noise', () => {
        const data = new Uint8ClampedArray(9 * 4).fill(100)
        data[16] = 255
        data[17] = 255
        data[18] = 255
        const input = {data, width: 3, height: 3}

        const result = medianFilter(input, 1)

        expect(result.data[16]).toBe(100)
    })
})

describe('adaptiveThreshold', () => {
    it('judge darker pixels from around ones as ink', () => {
        const data = new Uint8ClampedArray(9 * 4).fill(200)
        data[16] = 100
        data[17] = 100
        data[18] = 100
        const input = { data, width: 3, height: 3 }

        const result = adaptiveThreshold(input, 1, 10)

        expect(result.data[19]).toBe(255)
        expect(result.data[3]).toBe(0)
    })
})