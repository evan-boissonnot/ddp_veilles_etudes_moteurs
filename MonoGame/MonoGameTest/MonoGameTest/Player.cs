using System;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;

namespace MonoGameTest
{
    public class Player
    {
        static Texture2D playerSheetTexture;
        Animation run;
        Animation idle;
        Animation currentAnimation;
        SpriteEffects spriteEffect;

        float playerSpeed;
        float jump;
        float gravity;

        bool isJumping = false;

        public float X
        {
            get;
            set;
        }

        public float Y
        {
            get;
            set;
        }

        public Player(GraphicsDevice graphicsDevice)
        {
            if (playerSheetTexture == null)
            {
                using (var stream = TitleContainer.OpenStream("Content/playersheet.png"))
                {
                    playerSheetTexture = Texture2D.FromStream(graphicsDevice, stream);
                }
            }
            this.X = 100;
            this.Y = 100;

            spriteEffect = SpriteEffects.None;

            playerSpeed = 300;
            jump = 0;
            gravity = 400;

            run = new Animation();
            run.AddFrame(new Rectangle(50, 40, 50, 40), TimeSpan.FromSeconds(.10));
            run.AddFrame(new Rectangle(100, 40, 50, 40), TimeSpan.FromSeconds(.10));
            run.AddFrame(new Rectangle(150, 40, 50, 40), TimeSpan.FromSeconds(.10));
            run.AddFrame(new Rectangle(200, 40, 50, 40), TimeSpan.FromSeconds(.10));
            run.AddFrame(new Rectangle(250, 40, 50, 40), TimeSpan.FromSeconds(.10));

            idle = new Animation();
            idle.AddFrame(new Rectangle(150, 186, 50, 35), TimeSpan.FromSeconds(.10));
            idle.AddFrame(new Rectangle(200, 186, 50, 35), TimeSpan.FromSeconds(.10));
            idle.AddFrame(new Rectangle(250, 186, 50, 35), TimeSpan.FromSeconds(.10));
            idle.AddFrame(new Rectangle(300, 186, 50, 35), TimeSpan.FromSeconds(.10));
        }

        public void Update(GameTime gameTime, GraphicsDeviceManager graphics)
        {
            // temporary - we'll replace this with logic based off of which way the
            // character is moving when we add movement logic

            var kstate = Keyboard.GetState();

            if (isJumping)
            {
                this.Y -= jump /* (float)gameTime.ElapsedGameTime.TotalSeconds*/;//Making it go up
                jump -= 1;
                if(this.Y >= graphics.PreferredBackBufferHeight - 70)
                {
                    isJumping = false;
                }
            }
            else
            {
                this.Y += gravity * (float)gameTime.ElapsedGameTime.TotalSeconds;
                if (kstate.IsKeyDown(Keys.Space))
                {
                    isJumping = true;
                    jump = +15;
                }
            }

            if (kstate.IsKeyDown(Keys.Left))
            {
                this.X -= playerSpeed * (float)gameTime.ElapsedGameTime.TotalSeconds;
                currentAnimation = run;
                spriteEffect = SpriteEffects.FlipHorizontally;
            } else if (kstate.IsKeyDown(Keys.Right))
            {
                this.X += playerSpeed * (float)gameTime.ElapsedGameTime.TotalSeconds;
                spriteEffect = SpriteEffects.None;
                currentAnimation = run;
            } else
            {
                currentAnimation = idle;
            }

            if (this.X > graphics.PreferredBackBufferWidth - 80)
            {
                this.X = graphics.PreferredBackBufferWidth - 80;
            }
            else if (this.X < 0)
            {
                this.X = 0;
            }

            if (this.Y > graphics.PreferredBackBufferHeight - 70)
            {
                this.Y = graphics.PreferredBackBufferHeight - 70;
            }else if(this.Y < 0)
            {
                this.Y = 0;
            }

            currentAnimation.Update(gameTime);
        }

        public void Draw(SpriteBatch spriteBatch)
        {
            Vector2 topLeftOfSprite = new Vector2(this.X, this.Y);
            Color tintColor = Color.White;
            var sourceRectangle = currentAnimation.CurrentRectangle;

            spriteBatch.Draw(playerSheetTexture, topLeftOfSprite, null, sourceRectangle, null, 0, new Vector2(2, 2), tintColor, spriteEffect, 1);
        }
    }
}