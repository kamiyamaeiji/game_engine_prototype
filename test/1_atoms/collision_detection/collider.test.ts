import * as colliders from '../../../src/1_atoms/collision_detection/collider'
import p5 from 'p5'

/**
 * @jest-environment node
 */

test('当たり判定', function () {
    const test_value = colliders.square_collide(
        new p5.Vector(0, 0), 
        new p5.Vector(20, 10),
        new p5.Vector(10, 5),
        new p5.Vector(20, 10))
    expect(test_value.constructor).toBe(colliders.Inside);
});