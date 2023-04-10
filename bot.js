const { Telegraf } = require('telegraf');

const users = [];

class User {
  constructor(id) {

    this.id = id
    this.todos = []

  }
}


class Todo {
  constructor(data) {

    this.data = data;
    this.isDone = false;

  }

}



const bot = new Telegraf("5982807611:AAEi6De28PvpdcSTF8VS2Bsr4oHlBdFIe8s")


let isAdding = false;
let isWrote = false;
let isAlways = false;
let isMarking = false;
let currentUser = null;




bot.command('start', ctx => {

  if (users.length != 0) {
    let userExists = false
    for (let i = 0; i < users.length; i++) {
      if (users[i].id == ctx.from.id) {
        currentUser = users[i]
        userExists = true
        break
      }
    }
    if (!userExists) {
      currentUser = new User(ctx.from.id)
      users.push(currentUser)
    }
  } else {
    currentUser = new User(ctx.from.id)
    users.push(currentUser)
  }


ctx.reply(`Hello, ${ctx.from.first_name}, let's make your ToDo list! Use this commands to learn more about me:\n\n<b>/admins - I'll give contacts of my developers\n/start - to see this message again</b>`, {
  parse_mode: 'HTML',
  reply_markup: {
    keyboard: [["Add new"]],
    one_time_keyboard: true,
    resize_keyboard: true
  }
});
 });


 bot.command('admins', ctx => {

    ctx.reply("Contact with these cool guys:<b>\n\n@psnowik - Dmitry,\n@em0em0em04ka - Vadim,\n@nothingsignificant - Matvey.</b>", {parse_mode: 'HTML'})

 })
 

bot.hears("That's all for now", ctx => {

  isAdding = false;
  isWrote = false;


  if (currentUser.todos.length != 0) {
    isAlways = true
    if (isAlways) {
      try {

        ctx.reply("Good, your ToDos now in your ToDo list :)\n\n<i>See an available buttons below</i>", {
          parse_mode: 'HTML',
          reply_markup: {
            keyboard: [["Add new", "My ToDos"]],
            resize_keyboard: true,
            // one_time_keyboard: true
          }
        })

      } catch (error) {

        console.log(error)
        ctx.reply("Sorry, unexpected error...")

      }
    }

  } else {
    ctx.reply("Please, add at least one ToDo")
    isAdding = true;
  }
});


bot.hears("My ToDos", ctx => {

  if (currentUser.todos.length != 0 && currentUser.id == ctx.from.id) {
    isAlways = false

    const arr = currentUser.todos.map((todo, index) => {


        return `${index + 1}. ${todo.data}`

      
    })




    ctx.reply("There are your ToDos:\n\n" + arr.join('\n'), {

      parse_mode: 'HTML',
      reply_markup: {
        keyboard: [["Delete all", "Mark as done"]],
        resize_keyboard: true,
        // one_time_keyboard: true
      }
    })

  }
  else {
    ctx.reply("Your ToDo list is empty!")
  }

});


bot.hears("Delete all", ctx => {
  if (currentUser.todos.length != 0) {
    currentUser.todos.length = 0
    ctx.reply("Your ToDo list has been cleared", {

      reply_markup: {
        keyboard: [["Add new"]],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
  } else {
    ctx.reply("Your ToDo list is empty!")
  }

});


bot.hears("Mark as done", ctx => {

  let counter = 0

  currentUser.todos.forEach(todo => {
    if (todo.isDone == true) {
      counter++
    }
  })

  if (counter == currentUser.todos.length) {

    ctx.reply("All ToDos are done, relax")
    ctx.replyWithPhoto('https://media.istockphoto.com/id/1412242969/photo/close-up-cute-cat-and-golden-retriever-dog-chilling-and-sleeping-together-on-dog-bed.jpg?b=1&s=170667a&w=0&k=20&c=-u-Hn-NK3NXN8c5z0OOTgeTDPw47OuSO14USMDMO1ys=')

  } else {

    ctx.reply("Enter a ToDo's number that you want to mark as done")
    isMarking = true
  }



})



bot.hears("Add new", ctx => {
  isAdding = true;
  isWrote = false;
  isAlways = false
  ctx.reply("Write a new ToDo", {
    reply_markup: {
      keyboard: [["That's all for now"]],
      resize_keyboard: true,

    }
  })
});


bot.on('message', ctx => {
  if (isAdding) {
    currentUser.todos.push(new Todo(ctx.message.text));
    console.log(currentUser.todos);
    isWrote = true;
    ctx.reply("Anything else?", {
      reply_markup: {
        keyboard: [["That's all for now"]],
        resize_keyboard: true,

      }
    })
  }

  if (isMarking) {

    if (!Number(ctx.message.text)) {
      ctx.reply("Please, enter the ToDo's number that you want to mark as done")
    } else {


      let index = Number(ctx.message.text);
      currentUser.todos.forEach(todo => {



        if (currentUser.todos.indexOf(todo) == index - 1) {
          todo.data = `<s>${todo.data}</s>`
          todo.isDone = true
        }


      })

      const arr = currentUser.todos.map((todo, index) => {

          return `${index + 1}. ${todo.data}`

        
      })

      ctx.reply("There are your ToDos:\n\n" + arr.join('\n'), {
        parse_mode: 'HTML',
        reply_markup: {
          keyboard: [["Add new", "Delete all", "Mark as done"]],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      })
    }

    isMarking = false
    console.log(currentUser.todos)
  }



    if (users.length != 0) {
      let userExists = false
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == ctx.from.id) {
          currentUser = users[i]
          userExists = true
          break
        }
      }
      if (!userExists) {
        currentUser = new User(ctx.from.id)
        users.push(currentUser)
      }
    } else {
      currentUser = new User(ctx.from.id)
      users.push(currentUser)
    }
  
  console.log(currentUser.id)



});


bot.launch();
