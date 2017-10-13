import React from 'react';
import renderer from 'react-test-renderer';
import HomePage from './homePage';


describe('test UI Component', () => {
    it('should render home page correctly', () => {
        const tree = renderer.create(<HomePage />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});