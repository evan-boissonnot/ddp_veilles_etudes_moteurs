using System;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Input.Touch;

namespace MonoGameTest
{
    public class Player
    {
        static Texture2D playerSheetTexture;

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

        public CharacterEntity(GraphicsDevice graphicsDevice)
        {
            if (playerSheetTexture == null)
            {
                using (var stream = TitleContainer.OpenStream("Content/charactersheet.png"))
                {
                    playerSheetTexture = Texture2D.FromStream(graphicsDevice, stream);
                }
            }
        }

        public void Draw(SpriteBatch spriteBatch)
        {
            Vector2 topLeftOfSprite = new Vector2(this.X, this.Y);
            Color tintColor = Color.White;
            spriteBatch.Draw(playerSheetTexture, topLeftOfSprite, tintColor);
        }
    }
}