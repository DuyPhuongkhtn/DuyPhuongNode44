import {expect} from 'chai';

describe('Math operations', () => {
    // trong đây sẽ chứa tất cả test case của bộ test này
    it('should add two integer', () => {
        const result = 10 + 10;

        // sử dụng lib chai để mock kết quả trả về từ function hoặc biến
        expect(result).to.equal(20);
    });

})