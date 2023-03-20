import './style.css'
import {horizontal_movement, vertical_motion} from './1_atoms/math/game'
import * as text from './1_atoms/objects/text'
import * as line from './1_atoms/objects/line'
import {Rect} from './1_atoms/objects/rect'
import {Ally} from './1_atoms/game_objects/ally'
import {Enemy} from './1_atoms/game_objects/enemy'
import * as colliders from './1_atoms/collision_detection/collider'
import * as origin_draw from './2_molecules/draws/object_draw'
import p5 from 'p5'
import { index } from 'mathjs'

// object declaration
// let test_text_lst = [new text.Text(new p5.Vector(10, 220), new p5.Vector(20, 230) , "hogehoge")]
let own_rect_lst = [new Ally(new p5.Vector(50, 220), new p5.Vector(20, 30))]
let enemy_rect_lst = [new Enemy(new p5.Vector(100, 220), new p5.Vector(20, 30))]
let object_rect_lst = [ new Rect(new p5.Vector(300, 100), new p5.Vector(30, 300)), 
                      new Rect(new p5.Vector(0, 350), new p5.Vector(300, 30)),
                      new Rect(new p5.Vector(0, 100), new p5.Vector(30, 300)),
                      new Rect(new p5.Vector(0, 70), new p5.Vector(300, 30))]

// snake_case変換関数
function change_snake_change(str: string): string {
  const camelcase = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  return camelcase.split(/(?=[A-Z])/).join('_').toLowerCase()
}

// proxyオブジェクトの生成
function proxy_builder(...params: Rect[][]): Map<any, Rect[]> {
  let ans = new Map();
  for (let item_lst of params) {
    item_lst.forEach((value, index) => {
      const key_name = change_snake_change(value.constructor.name)
      console.log(key_name)
      if (index === 0) {
        ans.set(key_name, [new Proxy(value, {})])
      } else {
        const before_lst = ans.get(key_name)
        before_lst.push(new Proxy(value, {}))
        ans.set(key_name, before_lst)
      }
    })
  }
  return ans;
}

let proxy_lst = proxy_builder(own_rect_lst, enemy_rect_lst, object_rect_lst)


const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400)
  }

  p.draw = () => {
    p.background(255);
    let text = own_rect_lst[0]
    let new_text = new Ally(text.pos, text.size)
    let attach_status: Array<{[key: string]:Rect;}> = []
    let input_key = ""

    // キープレスをしたときに発火する
    if (p.keyIsPressed) {
      p.fill(0)

      // キーが入力された場合の分岐
      // ここはアーキテクチャを変更して、抽象化することが可能だ。
      if (p.keyCode == p.RIGHT_ARROW) {
        input_key = "right"
      } else if (p.keyCode == p.LEFT_ARROW) {
        input_key = "left"
      } else if(p.keyCode == p.DOWN_ARROW) {
        input_key = "down"
      } else if (p.keyCode == p.UP_ARROW) {
        input_key = "up"
      }
    }

    if (input_key === "right") {
      new_text.action("right")
    } else if (input_key === "left") {
      new_text.action("left")
    } else if (input_key === "down") {
      new_text.action("down")
    } else if (input_key === "up") {
      new_text.action("up")
    } else {
      new_text.action("down")
    }

    // 当たり判定判別
    for (let line of object_rect_lst) {
      if ( colliders.new_square_collide_2(new_text, line) === "inside") {
        attach_status.push({"collided_object": text, "collide_object": line})
      }
    }

    for (let item of enemy_rect_lst) {
      if ( colliders.new_square_collide_2(new_text, item) === "inside") {
        attach_status.push({"collided_object": text, "collide_object": item})
      }
    }

    // 当たり判定がない場合の処理
    if (!attach_status.some(value => value["collided_object"].id === text.id)) {
      // setterが発火する
      own_rect_lst[0] = new_text
    }

    // 当たった場合の処理
    // if (attach_status.some(value => value["collided_object"].id === text.id)) {
    //   // own_rect_lst[0] = new_text
    // }

    enemy_rect_lst.forEach((value, index) => {
      for (let attach_item of attach_status) {
        if (attach_item["collide_object"].id === value.id ) {
          value.action("collided")
          enemy_rect_lst[index] = value
        }
      }
    })

    origin_draw.origin_draw(p, own_rect_lst)
    origin_draw.origin_draw(p, enemy_rect_lst)
    origin_draw.origin_draw(p, object_rect_lst)
  }
}

new p5(sketch);
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <main>
    </main>
  </div>
`

// const sketch = (p: p5) => {
//   p.setup = () => {
//     p.createCanvas(400, 400)
//   }

//   p.draw = () => {
//     p.background(255);
//     if (p.keyIsPressed) {
//       p.fill(0)

//       let text = own_rect_lst[0]

//       let new_text = text
//       if (p.keyCode == p.RIGHT_ARROW) {
//         // const new_text_size = new p5.Vector(text.size.x + horizontal_movement(10, 1) , text.size.y )
//         // const new_text_pos = new p5.Vector(text.pos.x + 1 , text.pos.y )
//         new_text.set_x(1)
//         for (let line of object_rect_lst) {
//           // console.log("old_collide")
//           // console.log(colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) )
//           // console.log("test")
//           // console.log(new_text)
//           // console.log("test_line")
//           // console.log(line)
//           console.log("text")
//           console.log(text)
//           console.log("tet_collider")
//           console.log(colliders.new_square_collide_2(new_text, line))
//           if ( colliders.new_square_collide_2(new_text, line) === "inside") {
//             break
//           } else {
//             // text.pos.x = text.pos.x + 1
//             text.set_x(1)
//           }
//         }
//       } else if (p.keyCode == p.LEFT_ARROW) {
//         // const new_text_size = new p5.Vector(text.size.x - horizontal_movement(10, 1) , text.size.y )
//         const new_text_pos = new p5.Vector(text.pos.x - 1 , text.pos.y )
//         for (let line of object_rect_lst) {
//           console.log("left")
//           console.log(colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) )
//           if ( colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) === "inside") {
//             break
//           } else {
//             text.pos.x = text.pos.x - 1
//           }
//         }
//       } else if(p.keyCode == p.DOWN_ARROW) {
//           // const new_text_size = new p5.Vector(text.size.x + 1  , text.size.y )
//           const new_text_pos = new p5.Vector(text.pos.x + 1 , text.pos.y )
//           for (let line of object_rect_lst) {
//             console.log(colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) === "inside" )
//             console.log("down")
//             console.log("text_pos", new_text_pos)
//             console.log("size", text.size)
//             if ( colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) === "inside") {
//               break
//             } else {
//               text.pos.y = text.pos.y + 1
//             }
//           }
//           p.fill(0, 102, 153, 51)
//       } else if (p.keyCode == p.UP_ARROW) {
//         // const new_text_size = new p5.Vector(text.size.x + 1  , text.size.y )
//         const new_text_pos = new p5.Vector(text.pos.x - 1 , text.pos.y )
//         for (let line of object_rect_lst) {
//           console.log(colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) === "inside" )
//           console.log("down")
//           console.log("text_pos", new_text_pos)
//           console.log("size", text.size)
//           if ( colliders.new_square_collide(new_text_pos, text.size, line.pos, line.size) === "inside") {
//             break
//           } else {
//             text.pos.y = text.pos.y - 1 
//           }
//         }
//         p.fill(0, 102, 153, 51)
//       }

//     } 

//     p.fill(0)
//     origin_draw.origin_draw(p, own_rect_lst)
//     origin_draw.origin_draw(p, object_rect_lst)
//   }
// }