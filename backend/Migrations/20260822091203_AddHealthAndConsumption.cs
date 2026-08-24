using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddHealthAndConsumption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HealthRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateGiven = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NextDueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TargetType = table.Column<int>(type: "int", nullable: false),
                    TargetBirdId = table.Column<int>(type: "int", nullable: true),
                    TargetCageId = table.Column<int>(type: "int", nullable: true),
                    InventoryItemId = table.Column<int>(type: "int", nullable: true),
                    QuantityUsed = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthRecords_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthRecords_Birds_TargetBirdId",
                        column: x => x.TargetBirdId,
                        principalTable: "Birds",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HealthRecords_Cages_TargetCageId",
                        column: x => x.TargetCageId,
                        principalTable: "Cages",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_HealthRecords_InventoryItems_InventoryItemId",
                        column: x => x.InventoryItemId,
                        principalTable: "InventoryItems",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "InventoryConsumptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    InventoryItemId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DateConsumed = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryConsumptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InventoryConsumptions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InventoryConsumptions_InventoryItems_InventoryItemId",
                        column: x => x.InventoryItemId,
                        principalTable: "InventoryItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HealthRecords_InventoryItemId",
                table: "HealthRecords",
                column: "InventoryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthRecords_TargetBirdId",
                table: "HealthRecords",
                column: "TargetBirdId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthRecords_TargetCageId",
                table: "HealthRecords",
                column: "TargetCageId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthRecords_UserId",
                table: "HealthRecords",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryConsumptions_InventoryItemId",
                table: "InventoryConsumptions",
                column: "InventoryItemId");

            migrationBuilder.CreateIndex(
                name: "IX_InventoryConsumptions_UserId",
                table: "InventoryConsumptions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HealthRecords");

            migrationBuilder.DropTable(
                name: "InventoryConsumptions");
        }
    }
}
