const { Telegraf } = require('telegraf');


/// class product
class Product {
  constructor(name, price, description) {

    this.name = name
    this.description = description
    this.price = price

  }

  setDes(msg) {
    this.description = msg
  }

  setPrice(msg) {
    this.price = msg
  }

  setName(msg) {
    this.name = msg
  }
}


///global
let isSelecting = false
let isEditingPrice = false
let isEditingName = false
let isEditingDescription = false

let currentProduct = null
const big_keyboard = [["Edit price", "Edit description", "Edit name"], ["Delete this product", "Back"]];


///lists
const restricted = ['>', '<', '/'];
const products = [];
const temp = [];


const bot = new Telegraf("5891318186:AAGn1UiNaKn5Rysg5aTtcIxpc3kMSsgbh98")


bot.start(ctx => ctx.reply("To add a new product, write /add and name of a product, on a new line the price of the product "
  + "and on another new line the description of the product."))


bot.command('add', ctx => {

  const arr = ctx.message.text.split('\n');
  const temp_arr = arr[0].split(' ').slice(1)
  const name = temp_arr.join(' ')
  currentProduct = new Product(name, arr[1], arr[2])
  products.push(currentProduct)


  ctx.reply(`This is your product: \n ${currentProduct.name} \n <b>${currentProduct.price}</b> \n <i>${currentProduct.description} </i>`, {
    parse_mode: 'HTML',
    reply_markup: {
      //keyboard: [["Edit price", "Edit description", "Edit name"], ["Delete this product"]],
      keyboard: [["Show products"]],
      resize_keyboard: true
    }
  })
  console.log(products)
})


bot.hears("Show products", ctx => {

  const arr = products.map((product, index) => {
    return `${index + 1}. ${product.name}\n${product.description}\n${product.price}`
  })

  ctx.reply("There are products:\n" + arr.join('\n\n'), {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [["Select product"]]
    }
  })

})


bot.hears("Select product", ctx => {
  ctx.reply("Send a number of product that you want to edit")
  isSelecting = true;
})



bot.hears("Back", ctx => {
  currentProduct = null;
  ctx.reply("You can select any product", {
    parse_mode: 'HTML',
    reply_markup: {
      keyboard: [["Select product"]]
    }
  })
})


bot.hears("Edit price", ctx => {

  ctx.reply("Send a new price for this product")
  isEditingPrice = true


})


bot.hears("Edit name", ctx => {

  ctx.reply("Send a new name for this product")
  isEditingName = true

})


//bot.hears("Delete this product")


bot.on('message', ctx => {

  if (isSelecting) {
    try {
      if (Number(ctx.message.text)) {
        const index = Number(ctx.message.text) - 1;
        if (index + 1 > products.length || index + 1 < products.length) {
          ctx.reply("Incorrect input, try again")
        } else {
          currentProduct = products[index];

          console.table(currentProduct)
          isSelecting = false
          ctx.reply(`You've chosen ${index + 1} product`, {
            parse_mode: 'HTML',
            reply_markup: {
              keyboard: big_keyboard,
              resize_keyboard: true,
              one_time_keyboard: false
            }
          })
          isSelecting = false
        }
      } else {
        ctx.reply("Incorrect input!")
        isSelecting = true
      }
    }
    catch {
      ctx.reply("Unexpected error...")
    }
  }

  if (isEditingPrice) {
    if (Number(ctx.message.text) && Number(ctx.message.text) >= 0) {
      currentProduct.setPrice(ctx.message.text)
      ctx.reply("Price was updated!",)
      isEditingPrice = false
    } else {
      ctx.reply("Incorrect input, try again")
      isEditingPrice = true
    }
  }

  if (isEditingName) {
    let isIncorrect = false
    const check = ctx.message.text.split('');

    check.forEach( char => {
      if (restricted.includes(char)) {
        isIncorrect = true
      }
    })

    if (!isIncorrect) {

      currentProduct.setName(ctx.message.text)
      ctx.reply("Name was updated!",)
      isEditingName = false
    } else {
      ctx.reply("Name has restricted symbols")
      isIncorrect = false
    }
    }
  

})

bot.launch();
