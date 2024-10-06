import {expect} from 'chai';
import { it } from 'mocha';

describe('Math operations', () => {
    // trong đây sẽ chứa tất cả test case của bộ test này
    it('should add two integer', () => {
        const result = 10 + 10;

        // sử dụng lib chai để mock kết quả trả về từ function hoặc biến
        expect(result).to.equal(20);
    });

    it("Testing with array", () => {
        const arr = [1, 2, 3];

        // kiểm tra xem phần tử này có trong mảng hay không
        expect(arr).to.include(3);
    })

})